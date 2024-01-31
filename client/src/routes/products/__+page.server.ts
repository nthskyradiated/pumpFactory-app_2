
import {ProductsDocument} from '../../generated/graphql'

export async function load ({locals}:any) {


    const result = await locals.urqlClient.query(ProductsDocument,).toPromise()
	.then()
		console.log(result);
		if (result && result?.data?.products) {
			const {products} = result.data
			console.log(result.data.products);
			return {
			products: products
			}
		}
	
		
}
