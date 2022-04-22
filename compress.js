const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const gltfPipeline = require('gltf-pipeline');

const srcDir = '../static/models/original';
const distDir = '../static/models/compress';

const compressGltfWithDraco = (globs) => {
  glob(globs, async (err, files) => {
    if (err) return;

    for (const file of files) {
      const filePath = path.resolve(file);
      const gltf = fs.readJsonSync(filePath);
      const options = {
        resourceDirectory: path.dirname(filePath),
        dracoOptions: { compressionLevel: 10 }
      };
      const { glb } = await gltfPipeline.gltfToGlb(gltf, options);
      const outFilePath = filePath.replace('.gltf', '-draco.glb').replace(srcDir, distDir);
      await fs.mkdirp(path.dirname(outFilePath));
      await fs.writeFileSync(outFilePath, glb);
      console.log(`[draco] ${ outFilePath }`);
    }
  });
};

compressGltfWithDraco(`./${ srcDir }/**/*.gltf`);