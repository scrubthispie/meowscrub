/* eslint-disable no-inline-comments */
module.exports.endsWithAny = (suffixes, string) => {
  // suffixes is an array
  return suffixes.some(function (suffix) {
    return string.endsWith(suffix);
  });
};

module.exports.trim = (string, max) => {
  return string.length > max ? `${string.slice(0, max - 3)}...` : string;
};

function formatInt(int) {
  if (int < 10) return `0${int}`;
  return `${int}`;
}

module.exports.formatDuration = (milliseconds) => {
  if (!milliseconds || !parseInt(milliseconds)) return "00:00";
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const hours = Math.floor(milliseconds / 3600000);
  if (hours > 0) {
    return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`;
  }
  if (minutes > 0) {
    return `${formatInt(minutes)}:${formatInt(seconds)}`;
  }
  return `00:${formatInt(seconds)}`;
};

module.exports.urlify = (string) => {
  // not suitable
  // const pattern = new RegExp(
  //   "^(https?:\\/\\/)?" + // protocol
  //     "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
  //     "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
  //     "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
  //     "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
  //     "(\\#[-a-z\\d_]*)?$",
  //   "i"
  // ); // fragment locator

  const pattern = /^((ftp|http|https):\/\/)?www\.([A-z]+)\.([A-z]{2,})/;

  return string.replace(pattern, function (url) {
    // eslint-disable-next-line quotes
    return '<a href="' + url + '">' + url + "</a>";
  });
};

module.exports.compareMaps = (map1, map2) => {
  let testVal;
  if (map1.size !== map2.size) {
    return false;
  }
  for (const [key, val] of map1) {
    testVal = map2.get(key);
    // in cases of an undefined value, make sure the key
    // actually exists on the object so there are no false positives
    if (
      JSON.stringify(testVal) !== JSON.stringify(val) ||
      (testVal === undefined && !map2.has(key))
    ) {
      return false;
    }
  }
  return true;
};
