const _bp: number[] = [
  320 /* smartphones, iPhone, portrait 480x320 phones */,
  481 /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */,
  641 /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */,
  961 /* tablet, landscape iPad, lo-res laptops ands desktops */,
  1025 /* big landscape tablets, laptops, and desktops */,
  1281 /* hi-res laptops and desktops */,
];

const mq_min: string[] = _bp.map((bp) => `@media (min-width: ${bp}px)`);

const mq_max: string[] = _bp.map((bp) => `@media (max-width: ${bp}px)`);

export enum bp {
  xxs = 320 /* smartphones, iPhone, portrait 480x320 phones */,
  xs = 481 /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */,
  sm = 641 /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */,
  md = 961 /* tablet, landscape iPad, lo-res laptops ands desktops */,
  lg = 1025 /* big landscape tablets, laptops, and desktops */,
  xl = 1281 /* hi-res laptops and desktops */,
}
