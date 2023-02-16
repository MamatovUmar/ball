/* eslint-disable @typescript-eslint/no-explicit-any */

type Module = {
  moduleName: string, glueUrl: string, wasmUrl: string, fallbackUrl: string
}

const PRELOAD_MODULES: Array<Module> = [
  {
    'moduleName': 'Ammo',
    'glueUrl': '/lib/ammo/ammo.wasm.js',
    'wasmUrl': '/lib/ammo/ammo.wasm.wasm',
    'fallbackUrl': '/lib/ammo/ammo.js'
  },
  {
    'moduleName': 'BASIS',
    'glueUrl': '/lib/basis/basis.wasm.js',
    'wasmUrl': '/lib/basis/basis.wasm.wasm',
    'fallbackUrl': '/lib/basis/ammo/basis.js'
  }
]


// Check WASM support
function wasmSupported() {
  try {
    if (typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function') {
      const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00))
      if (module instanceof WebAssembly.Module)
        return new WebAssembly.Instance(module) instanceof WebAssembly.Instance
    }
  } catch (e) {
    console.log('WASM support error: ', e)
  }
  return false
}

function loadModules(modules: Array<Module>, doneCallback: () => void) {
  if (wasmSupported()) {
    // @ts-ignore
    Promise.all(modules.map(loadWasmModuleAsync)).then(doneCallback)
  } else {
    throw new Error('wasm not supported')
  }
}

declare global {
  interface Window {
    [key: string]: any
  }
}

function loadWasmModuleAsync(module: Module): Promise<void> {
  // @ts-ignore
  return new Promise((resolve) => {
    const checkModule = window[module.moduleName]
    if (checkModule === undefined) {
      console.log('LOAD MODULES ====>', module.moduleName, 'checkModule === undefined, loading module...')
      loadScriptAsync(module.moduleName, module.glueUrl).then(() => {
        const lib = window[module.moduleName]
        console.log('loaded lib ->', module.moduleName)
        window[module.moduleName + 'Lib'] = lib
        lib({
          locateFile: function () {
            return module.wasmUrl
          }
        }).then(function (instance: any) {
          console.log('LOAD MODULES ====>', module.moduleName, 'module loaded successfully')
          window[module.moduleName] = instance
          resolve()
        })
      })
    } else {
      console.log('LOAD MODULES ====>', module.moduleName, 'checkModule === module, module already loaded')
      resolve()
    }
  })
}

function loadScriptAsync(moduleName: string, url: string): Promise<void> {
  // @ts-ignore
  return new Promise((resolve) => {
    const checkScript = document.getElementById(moduleName)
    const createScript = () => {
      const tag = document.createElement('script')
      tag.setAttribute('id', moduleName)
      tag.onload = function () {
        resolve()
      }
      tag.onerror = function () {
        throw new Error('failed to load ' + url)
      }
      tag.async = true
      tag.setAttribute('src', url)
      document.body.appendChild(tag)
    }
    if (checkScript === null) {
      createScript()
    } else {
      console.log('lib script already loaded')
      if (checkScript.parentNode)
        checkScript.parentNode.removeChild(checkScript)
      createScript()
    }
  })
}

export default (cb: () => void) => {
  const libs = ['Ammo', 'BASIS']
  libs.forEach(lib => {
    window[lib] = undefined
    window[lib + 'Lib'] = undefined
  })
  loadModules(PRELOAD_MODULES, cb)
}