import { buildParams } from 'src/ultils/common';
import { get } from 'src/ultils/request';

export function getDataTableList(data: any) {
  const { link, queryParam, defaultParam } = data;
  const newQueryParam = '?' + buildParams({ ...defaultParam, ...queryParam });
  return get(link + (queryParam ? newQueryParam : '')).then((resp: any) => {
    try {
      if (resp && resp.data) {
        return resp.data;
      }
    } catch (e: any) {
      throw new Error(e);
    }
  });
}

// export function getDataTableList(data: any) {
//   return new Promise(resolve =>
//     setTimeout(
//       () =>
//         resolve({
//           data: [
//             {
//               id: 1,
//               name: 'COMMON.csv',
//               type: '1',
//               email: 'Name',
//               link: data?.link,
//             },
//             {
//               id: 1,
//               name: 'INDIVIDUAL.csv',
//               type: '0',
//               email: 'Name',
//               link: data?.link,
//             },
//           ],
//           count: 1,
//         }),
//       500,
//     ),
//   );
// }
