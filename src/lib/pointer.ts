/** Shared, mutable pointer state (read every frame by the 3D scene, cursor glow, etc.). */
export const pointer = {
  x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, // client px
  y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  nx: 0, ny: 0,   // -1..1 (y up)
  sx: 0, sy: 0,   // smoothed nx / ny (updated by the 3D rig)
  active: false,
};

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ny = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.active = e.pointerType !== 'touch';
    },
    { passive: true },
  );
}
