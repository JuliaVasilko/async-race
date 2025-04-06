import { Component } from '@/utils/component';

export class FlagSvgComponent extends Component {
  svgIcon: SVGElement | null = null;

  constructor() {
    super({ className: 'flag-icon' });

    this.svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.svgIcon.setAttribute('viewBox', '0 0 512.001 512.001');
    this.svgIcon.setAttribute('style', 'enable-background:new 0 0 512.001 512.001;');
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', 'M471.051,138.995L139.506,0.771c-3.088-1.288-6.612-0.946-9.394,0.909c-2.782,1.854-4.454,4.978-4.454,8.321V286.45c0,7,7.361,11.938,13.848,9.229l331.545-138.225c3.726-1.553,6.152-5.193,6.152-9.229S474.777,140.548,471.051,138.995zM145.658,271.447V25.004l295.558,123.221L145.658,271.447z');
    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', 'M173.368,73.632l35.771,14.913c1.258,0.524,2.561,0.772,3.844,0.772c3.915,0,7.633-2.315,9.234-6.155c2.125-5.098-0.285-10.952-5.383-13.078l-35.771-14.913c-5.096-2.122-10.951,0.284-13.078,5.383C165.861,65.652,168.271,71.506,173.368,73.632z');
    const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path3.setAttribute('d', 'M253.604,107.083l120.824,50.371c1.258,0.525,2.561,0.773,3.844,0.773c3.915,0,7.633-2.315,9.233-6.155c2.126-5.098-0.284-10.952-5.382-13.078L261.299,88.622c-5.095-2.125-10.951,0.284-13.077,5.383C246.096,99.103,248.506,104.957,253.604,107.083z');
    const path4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path4.setAttribute('d', 'M160.79,492.001h-46.063v-482c0-5.522-4.478-10-10-10c-5.522,0-10,4.478-10,10v482h-49.93c-5.522,0-10,4.478-10,10c0,5.522,4.478,10,10,10h59.93h56.063c5.522,0,10-4.478,10-10C170.79,496.479,166.313,492.001,160.79,492.001z');
    const path5 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path5.setAttribute('d', 'M216.853,492.001h-11.599c-5.522,0-10,4.478-10,10c0,5.522,4.478,10,10,10h11.599c5.522,0,10-4.478,10-10C226.853,496.479,222.375,492.001,216.853,492.001z');
    this.svgIcon.append(path1, path2, path3, path4, path5);
    this.svgIcon.setAttribute('fill', 'green');
    this.svgIcon.setAttribute('height', '24px');

    this.getNode().appendChild(this.svgIcon);
  }

  remove(): void {
    super.remove();
    this.svgIcon?.remove();
    this.svgIcon = null;
  }
}
