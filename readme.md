
# Vider-downloader

Download videos from [**vider.info**](https://vider.info/), my primary, highly legal, and (with the help of this software) completely ad-free source of the Dr. House series.

![](docs/screen.png)

## Table of Contents

- [Vider-downloader](#vider-downloader)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Warning - ad block](#warning---ad-block)
    - [Solution #1](#solution-1)
    - [Solution #2](#solution-2)

## Installation

NPM:
```
$ npm i -g --save @vider-downloader/cli
```

Yarn:
```
$ yarn global add @vider-downloader/cli
```

## Usage

```
$ vider-dl <vider-link-or-code>
```

Example (full link):

```
$ vider-dl https://vider.info/vid/+fs8xec
```

Example (code):
```
$ vider-dl +fs8xec
```

## Warning - ad block

After a few downloads, vider will block your IP.

### Solution #1

Go to [the vider website](https://vider.info/) and solve the CAPTCHA (might take a few tries).

### Solution #2

Visit the video manually first and trigger the ads. You don't have to watch them, just the initial trigger is enough. Vider shouldn't block you whatsoever this way.

This might be automated in upcoming versions.