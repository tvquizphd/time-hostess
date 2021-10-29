import modulePackage from '../../package.json'
import {tmpdir, homedir} from 'os'
import fs from 'fs-extra'
import path from 'path'

const configure = () => {
  const {version, name} = modulePackage
  const input = path.resolve('./out')
  const root = path.join(homedir(),`${name}-builds`)
  const output = path.join(root, `${name}-${version}`)
  return {input, output}
}

const copyFolder = (srcDir, destDir, overwrite) => {
  fs.copySync(srcDir, destDir, {overwrite}, (err) => {
    if (err) {                 
      console.error(err)
    } else {
      console.log(`cp -R ${srcDir}/ ${destDir}/`)
    }
  })
}

const tempFolder = (prefix) => {
  return new Promise((resolve, reject) => {
    fs.mkdtemp(path.join(tmpdir(), `${prefix}-`), (err, folder) => {
      if (err) throw reject(err)
      resolve(folder)
    })
  })
}

const main = () => {
  const {input, output} = configure()
  if (!fs.existsSync(input)) {
    console.error(`Missing ${input}\n Have you built and exported?`)
  }
  if (!fs.existsSync(output)) {
    console.error(`Missing ${output}\n Please create directory.`)
  }
  // Preserve .git files temporarily
  const gitOutput = path.join(output, '.git')
  if (!fs.existsSync(gitOutput)) {
    copyFolder(input, output, true)
    return
  }
  console.warn('Preserving git history')
  tempFolder('git').then((gitTemp) => {
    copyFolder(gitOutput, gitTemp)
    copyFolder(input, output, true)
    copyFolder(gitTemp, gitOutput, true)
  }).catch(err => console.error(err))
}
main()
