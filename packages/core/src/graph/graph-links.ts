import { GraphNode } from './graph-node';

/**
 * Represents a connection between two {@link Element} resources in a {@link Graph}.
 *
 * The left element is considered the owner, and the right element the resource. The
 * owner is responsible for being able find and remove a reference to a resource, given
 * that link. The resource does not hold a reference to the link or to the owner,
 * although that reverse lookup can be done on the graph.
 *
 * @hidden
 * @category Graph
 */
export class Link<Left extends GraphNode, Right extends GraphNode> {
	private disposed = false;
	private readonly listeners: (() => void)[] = [];
	constructor(private readonly name: string, private left: Left, private right: Right) {}

	/** Name. */
	getName(): string { return this.name; }

	/** Owner element. */
	getLeft(): Left { return this.left; }

	/** Resource element. */
	getRight(): Right { return this.right; }

	/** Destroys a (currently intact) link, updating both the graph and the owner. */
	dispose(): void {
		if (this.disposed) return;
		this.disposed = true;
		this.listeners.forEach((fn) => fn());
		this.listeners.length = 0;
	}

	/** Registers a listener to be invoked if this link is destroyed. */
	onDispose(fn: () => void): Link<Left, Right> {
		this.listeners.push(fn);
		return this;
	}

	/** Whether this link has been destroyed. */
	isDisposed(): boolean { return this.disposed; }
}
