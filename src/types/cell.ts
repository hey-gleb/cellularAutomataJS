import type { Element } from '../elements/base';


export interface Neighbors {
  topLeft: Element;
  top: Element;
  topRight: Element;
  left: Element;
  right: Element;
  bottomLeft: Element;
  bottom: Element;
  bottomRight: Element;
}