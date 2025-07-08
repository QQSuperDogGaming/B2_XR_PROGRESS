const totalPages = 12; // Number of physical book pages

// Define images for each page (image anchor index = page - 1)
const pageImages = {
  0: ['1.png', '2.png'],
  1: ['1.png'],
  2: ['1.png', '2.png', '3.png'],
  3: ['1.png'],
  4: ['1.png', '2.png'],
  5: ['1.png'],
  6: ['1.png'],
  7: ['1.png', '2.png'],
  8: ['1.png'],
  9: ['1.png'],
  10: ['1.png', '2.png'],
  11: ['1.png']
};

// Load 2D image as texture and render it as a flat plane
const loadImageOnPlane = async (group, pageIndex, imageIndex) => {
  const loader = new THREE.TextureLoader();
  const texture = await loader.loadAsync(`assets/images/page${pageIndex + 1}/${pageImages[pageIndex][imageIndex]}`);

  group.clear(); // remove previous image

  const geometry = new THREE.PlaneGeometry(1, 0.7); // Adjust size as needed
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);
};

// Setup swipe gesture for left/right navigation
const setupSwipe = (pageIndex, group, updateImage) => {
  const hammer = new Hammer(document.body);
  hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
  hammer.on("swipeleft", () => updateImage(1));
  hammer.on("swiperight", () => updateImage(-1));
};

const startAR = async () => {
  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.querySelector("#ar-container"),
    imageTargetSrc: "./assets/targets/book.mind"
  });

  const { renderer, scene, camera } = mindarThree;

  for (let i = 0; i < totalPages; i++) {
    const anchor = mindarThree.addAnchor(i);
    const group = anchor.group;

    let currentIndex = 0;

    anchor.onTargetFound = () => {
      loadImageOnPlane(group, i, currentIndex);

      setupSwipe(i, group, (direction) => {
        const images = pageImages[i];
        currentIndex = (currentIndex + direction + images.length) % images.length;
        loadImageOnPlane(group, i, currentIndex);
      });
    };
  }

  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
};

startAR();
