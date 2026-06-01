// Ensure React Refresh globals exist to avoid preamble detection errors
if (typeof window !== 'undefined') {
  window.$RefreshReg$ = window.$RefreshReg$ || function () {}
  window.$RefreshSig$ = window.$RefreshSig$ || (function () {
    return function (type) { return type }
  })()
}
