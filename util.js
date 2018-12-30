function timeSince(time) {
  let secondsSince = Date.now() / 1000 - time; //reddit returns time in seconds, js in milliseconds
  if (secondsSince < 60) return `${Math.floor(secondsSince)} seconds ago`;
  if (secondsSince < 60 * 60)
    return `${Math.floor(secondsSince / 60)} minutes ago`;
  if (secondsSince < 60 * 60 * 24)
    return `${Math.floor(secondsSince / 60 / 60)} hours ago`;
  else return `${Math.floor(secondsSince / 60 / 60 / 24)} days ago`;
}

function elemMaker(elem, config) {
  let element = document.createElement(elem);
  for (key in config) element[key] = config[key];
  return element;
}
