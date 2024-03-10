package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

func main() {
	println("WARNING! - This program might stop working whenever vider.info changes its code.")
	args := os.Args[1:]
	if len(args) != 1 {
		println("missing video link, link should be like https://vider.info/vid/+fs8m8m")
	}
	title, link, err := getVideoURL("https://vider.info/vid/+fs8m8m")
	if err != nil {
		fmt.Printf("%v\n", err)
		os.Exit(1)
	}
	err = download(title, link)
	if err != nil {
		fmt.Printf("%v\n", err)
		os.Exit(1)
	}

}

func getVideoURL(entryUrl string) (string, string, error) {
	println("Getting video metadata...")
	if !strings.Contains(entryUrl, "https://vider.info/vid/+f") {
		return "", "", fmt.Errorf("invalid video url")
	}
	code := strings.Replace(entryUrl, "https://vider.info/vid/+f", "", -1)

	req, err := http.NewRequest("GET", "https://vider.pl/embed/video/"+code, nil)
	if err != nil {
		return "", "", fmt.Errorf("error creating request: %v", err)
	}
	req.Header.Set("accept", "*/*")
	req.Header.Set("accept-language", "en-US,en;q=0.9")
	req.Header.Set("cache-control", "no-cache")
	req.Header.Set("pragma", "no-cache")
	req.Header.Set("sec-ch-ua", "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"")
	req.Header.Set("sec-ch-ua-mobile", "?0")
	req.Header.Set("sec-ch-ua-platform", "\"Windows\"")
	req.Header.Set("sec-fetch-dest", "video")
	req.Header.Set("sec-fetch-mode", "no-cors")
	req.Header.Set("sec-fetch-site", "cross-site")
	req.Header.Set("Referer", "https://vider.pl/")
	req.Header.Set("Referrer-Policy", "strict-origin-when-cross-origin")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", "", err
	}
	defer resp.Body.Close()
	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return "", "", err
	}
	if doc.Find("[name='google-site-verification']").Length() > 0 {
		return "", "", fmt.Errorf("vider blocks you with CAPTCHA, go to " + entryUrl + " and solve the CAPTCHA, then try again")
	}
	title, titleExists := doc.Find("[name='title']").Attr("content")
	if !titleExists {
		return "", "", fmt.Errorf("title not found")
	}
	code, codeExists := doc.Find("#video_player").Attr("data-file-id")
	if !codeExists {
		return "", "", fmt.Errorf("code not found")
	}

	return title, fmt.Sprintf("https://stream.vider.info/video/%s/v.mp4?uid=0", code), nil
}

func titleToFilename(title string) string {
	return regexp.MustCompile("[^A-z0-9 _]+").ReplaceAllString(title, "-")
}

func download(title string, url string) error {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return fmt.Errorf("error creating request: %v", err)
	}
	req.Header.Set("accept", "*/*")
	req.Header.Set("accept-language", "en-US,en;q=0.9")
	req.Header.Set("cache-control", "no-cache")
	req.Header.Set("pragma", "no-cache")
	req.Header.Set("range", "bytes=0-")
	req.Header.Set("sec-ch-ua", "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"")
	req.Header.Set("sec-ch-ua-mobile", "?0")
	req.Header.Set("sec-ch-ua-platform", "\"Windows\"")
	req.Header.Set("sec-fetch-dest", "video")
	req.Header.Set("sec-fetch-mode", "no-cors")
	req.Header.Set("sec-fetch-site", "cross-site")
	req.Header.Set("Referer", "https://vider.pl/")
	req.Header.Set("Referrer-Policy", "strict-origin-when-cross-origin")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("error executing request: %v", err)
	}
	if resp.StatusCode >= 300 {
		return fmt.Errorf("bad response code: %v", resp.StatusCode)
	}
	defer resp.Body.Close()

	outPath, err := filepath.Abs(titleToFilename(title) + ".mp4")
	if err != nil {
		return fmt.Errorf("error creating output file's path: %v", err)
	}
	outFile, err := os.Create(outPath)
	if err != nil {
		return fmt.Errorf("error creating the output file: %v", err)
	}
	defer outFile.Close()

	buf := make([]byte, 32*1024)
	var downloaded int64
	for {
		n, err := resp.Body.Read(buf)
		if err != nil {
			if err == io.EOF {
				log.Printf("finished downloading")
				break
			}
			return fmt.Errorf("error reading chunk: %v", err)
		}
		downloaded += int64(n)
		fmt.Printf("\rDownloading: %.2f%%", float64(downloaded)/float64(resp.ContentLength)*100)
		if _, err := outFile.Write(buf[:n]); err != nil {
			return fmt.Errorf("error writing to file: %v", err)
		}
	}
	fmt.Printf("Downloaded %s to %s", title, outPath)
	return nil
}
