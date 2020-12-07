export const parseVideoCode = (urlOrCode: string) => {
  try {
    const url = new URL(urlOrCode);
    const match = url.pathname.match(/.*\/(.*)$/);
    return match ? match[1] : undefined;
  } catch (e) {
    return urlOrCode[0] === "+" ? urlOrCode.slice(1) : urlOrCode;
  }
};
