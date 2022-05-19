export class Queue<T> {
  private elements: Record<number, T>;
  private head: number;
  private tail: number;

  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }

  enqueue(element: T) {
    this.elements[this.tail] = element;
    this.tail++;
  }

  enqueues(elements: T[]) {
    elements.forEach(e => this.enqueue(e));
  }

  dequeue() {
    if (this.isEmpty) {
      return null;
    }
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }

  peek() {
    return this.elements[this.head];
  }

  peekNext() {
    return this.elements[this.head + 1];
  }

  get length() {
    return this.tail - this.head;
  }
  get isEmpty() {
    return this.length === 0;
  }
}
