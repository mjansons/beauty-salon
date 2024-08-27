// import { TRPCError } from '@trpc/server'
// import provideRepos from '@server/trpc/provideRepos'
// import { businessRepository } from '@server/repositories/businessRepository'
// import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure/index'
// import { newBusinessSpeciality } from '@server/schemas/businessSpecialitySchema'
// import { userRepository } from '@server/repositories/userRepository'
// import { assertError } from '@server/utils/errors'
// import { roleRepository } from '@server/repositories/roleRepository'

// export default authenticatedProcedure
//   .use(
//     provideRepos({
//       businessRepository,
//       userRepository,
//       roleRepository,
//     })
//   )
//   .input(newBusinessSpeciality)
//   .mutation(
//     async ({
//       input: { businessId, specialityId, price },
//       ctx: { repositories, authUser },
//     }) => {

//       // does business exist?

//       // is business of user? maybe I need business owner procedure?

//       // does speciality exist?


//       //



//       const user = await repositories.userRepository.find_registered_user_by_id(
//         authUser.id
//       )
//       if (!user) {
//         throw new TRPCError({
//           code: 'NOT_FOUND',
//           message: 'The server cannot find the requested user.',
//         })
//       }

//       const businessCreated = await repositories.businessRepository
//         .add_business(
//           name,
//           authUser.id,
//           city,
//           address,
//           postalCode,
//           email,
//           phoneNumber
//         )
//         .catch((error: unknown) => {
//           assertError(error)

//           if (error.message.includes('duplicate key')) {
//             throw new TRPCError({
//               code: 'BAD_REQUEST',
//               message: 'Business with this name already exists',
//               cause: error,
//             })
//           }
//           throw error
//         })

//       // should add owner role to user if he doesnt have it already
//       const userRoles =
//         await repositories.roleRepository.get_user_assigned_roles(authUser.id)
//       const foundUserRole = userRoles.find((r) => r.roleId === 3)

//       if (foundUserRole === undefined) {
//         try {
//           await repositories.roleRepository.add_role_to_user(authUser.id, 3)
//         } catch (error) {
//           throw new TRPCError({
//             code: 'BAD_REQUEST',
//             message: 'Failed to assign owner role to the user.',
//             cause: error,
//           })
//         }
//       }

//       return businessCreated
//     }
//   )
