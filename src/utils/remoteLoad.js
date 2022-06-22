export function loadBMap(ak, type) {
return new Promise(function(resolve, reject) {
  if (typeof window.BMap !== 'undefined') {
    resolve(window.BMap)
    return true
  }
  window.onBMapCallback = function() {
    removeScript(script)
    resolve(window.BMap)
  }
  let script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = type === 'GL'
    ? 'https://api.map.baidu.com/api?type=webgl&v=1.0&ak=' + ak + '&callback=onBMapCallback'
    : 'https://api.map.baidu.com/api?v=3.0&ak=' + ak + '&callback=onBMapCallback'
  script.onerror = reject
  document.head.appendChild(script)
})
}

function removeScript (scriptElement) {
  document.head.removeChild(scriptElement)
}
