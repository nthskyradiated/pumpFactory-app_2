// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import { Client } from "@urql/core"

// and what to do when importing types
declare namespace App {
	interface Locals {
		user: {
			name: string
			role: string
		},
        urqlClient: Client
	}

	// interface PageData {}

	// interface Platform {}
}