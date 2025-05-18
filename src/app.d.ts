// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { AwilixContainer } from "awilix";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			container: AwilixContainer;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
