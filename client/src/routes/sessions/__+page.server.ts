
import { AttendancesDocument} from '../../generated/graphql'


export async function load ({locals}:any) {


    const result = await locals.urqlClient.query(AttendancesDocument,).toPromise()
	.then()
		console.log(result);
		if (result && result?.data?.attendances) {
			const {attendances} = result.data
			console.log(result.data.attendances);
			return {
			attendances: attendances
			}
		}
	
		
}
