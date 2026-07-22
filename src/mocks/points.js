import { getRandomArrayElement } from '../utils/utils';

const mockPoints = [
  {
    'id': '9662deb1-8fce-478b-b1ed-35e3a0c16047',
    'basePrice': 468,
    'dateFrom': '2026-08-23T14:35:05.704Z',
    'dateTo': '2026-08-23T22:47:05.704Z',
    'destination': 'c3454b7a-4775-419f-a844-b9b1e89ae2ae',
    'isFavorite': true,
    'offers': [
      '8bdd871a-1ba8-4237-9886-6f5b04394508'
    ],
    'type': 'taxi'
  },
  {
    'id': 'a576c9f5-4aa0-465d-a521-9a692604a599',
    'basePrice': 3936,
    'dateFrom': '2026-08-24T06:54:05.704Z',
    'date_to': '2026-08-25T07:06:05.704Z',
    'destination': 'de831c97-902a-4d75-befc-f07ae630e63d',
    'isFavorite': false,
    'offers': [],
    'type': 'restaurant'
  },
  {
    'id': 'b4d960d0-ae4a-468c-8e5f-c256b1220912',
    'basePrice': 2742,
    'dateFrom': '2026-08-27T04:28:05.704Z',
    'dateTo': '2026-08-28T15:22:05.704Z',
    'destination': '679b051a-5269-493b-81f0-89cdcbe0ac0f',
    'isFavorite': false,
    'offers': [
      'ac4a1ff6-84f2-492b-8ab1-9a9f2fc885f8',
      '88cb7f5e-b401-4c4f-bf26-6afc34175836',
      '8bdd871a-1ba8-4237-9886-6f5b04394508'
    ],
    'type': 'taxi'
  },
  {
    'id': '9e13860e-da5c-4a6a-a254-6e510e194b2d',
    'basePrice': 1146,
    'dateFrom': '2026-08-29T17:50:05.704Z',
    'dateTo': '2026-08-30T09:33:05.704Z',
    'destination': '368365d1-767f-4844-b864-ad1d61d0d74a',
    'isFavorite': false,
    'offers': [
      'a9aa5e5b-37a8-4c81-8df7-f96b72478b6f',
      'c97c78cc-f1a4-4948-b3df-33dce36309f0',
      '0e1b6743-56bc-42fd-a10d-e300d5eccc71'
    ],
    'type': 'check-in'
  },
  {
    'id': '7d4c8785-cb08-4b63-af78-2d6d14f24619',
    'basePrice': 3702,
    'dateFrom': '2026-08-31T11:57:05.704Z',
    'dateTo': '2026-09-02T04:07:05.704Z',
    'destination': '4a60b318-5f85-4c53-96ba-e5b137389dce',
    'isFavorite': false,
    'offers': [],
    'type': 'ship'
  },
  {
    'id': 'fe0c7a0a-3bb0-4ecd-944a-79706cfd1f4b',
    'basePrice': 8087,
    'dateFrom': '2026-09-04T03:10:05.704Z',
    'dateTo': '2026-09-05T23:38:05.704Z',
    'destination': '4a60b318-5f85-4c53-96ba-e5b137389dce',
    'isFavorite': false,
    'offers': [
      'c97c78cc-f1a4-4948-b3df-33dce36309f0',
      '0e1b6743-56bc-42fd-a10d-e300d5eccc71'
    ],
    'type': 'check-in'
  },
  {
    'id': 'bbadd7db-af13-4e2f-ba0b-387bbdc8b8d5',
    'basePrice': 2955,
    'dateFrom': '2026-09-07T01:25:05.704Z',
    'dateTo': '2026-09-08T22:44:05.704Z',
    'destination': '368365d1-767f-4844-b864-ad1d61d0d74a',
    'isFavorite': true,
    'offers': [
      '0fbf92f7-ff67-4b3e-8d9d-a01d6ef751bd',
      '536495b0-31e3-4fb0-a8da-2b72ca1491e7',
      'fba6c0cc-7f15-4678-8372-3c87080631b3'
    ],
    'type': 'flight'
  },
  {
    'id': '6eb12ff8-2569-46b8-966d-26899c8d7409',
    'basePrice': 2820,
    'dateFrom': '2026-09-10T23:37:05.704Z',
    'dateTo': '2026-09-12T08:14:05.704Z',
    'destination': 'c9890734-7f48-4568-a245-37d8aed2d6ad',
    'isFavorite': true,
    'offers': [
      '1e09f428-258b-44ee-aaa1-ec35d5e34aa6'
    ],
    'type': 'bus'
  },
  {
    'id': '631a21e6-1991-490a-9f31-2888a82ffe4e',
    'basePrice': 7001,
    'dateFrom': '2026-09-12T18:26:05.704Z',
    'dateTo': '2026-09-13T11:24:05.704Z',
    'destination': '679b051a-5269-493b-81f0-89cdcbe0ac0f',
    'isFavorite': false,
    'offers': [
      '8232fde8-b042-4349-8cde-f0bd20387e82',
      'ba37f6bd-115f-42bf-8690-1d407027b876',
      'ed5ac00b-8b86-4a95-9a7b-6c6098f82b54',
      '433c093c-3791-451a-88aa-e279253618c4',
      'b9add7ce-19a8-4705-bc84-fed6b2852dfc',
      'd064193b-a0c1-4765-b03c-f08538fae49b'
    ],
    'type': 'ship'
  },
  {
    'id': '03ea1d0f-3bef-4cd2-87d5-f9e5dce81416',
    'basePrice': 6119,
    'dateFrom': '2026-09-14T04:42:05.704Z',
    'dateTo': '2026-09-15T15:35:05.704Z',
    'destination': '38ba2903-0217-4d5b-97af-aafa458b60ff',
    'isFavorite': false,
    'offers': [
      'a9aa5e5b-37a8-4c81-8df7-f96b72478b6f',
      'c97c78cc-f1a4-4948-b3df-33dce36309f0',
      '0e1b6743-56bc-42fd-a10d-e300d5eccc71'
    ],
    'type': 'check-in'
  },
  {
    'id': '8516fc6a-f2fa-4b3b-987a-e6f3fccb02e1',
    'basePrice': 5633,
    'dateFrom': '2026-09-16T14:02:05.704Z',
    'dateTo': '2026-09-17T23:31:05.704Z',
    'destination': 'c3454b7a-4775-419f-a844-b9b1e89ae2ae',
    'isFavorite': false,
    'offers': [],
    'type': 'train'
  },
  {
    'id': '52fec4ed-2061-4d38-b7cf-9071e9510c53',
    'basePrice': 9245,
    'dateFrom': '2026-09-19T01:05:05.704Z',
    'dateTo': '2026-09-19T17:42:05.704Z',
    'destination': '9c39c4a1-c01a-46bc-a114-6692baedb062',
    'isFavorite': true,
    'offers': [],
    'type': 'taxi'
  }
];

const getRandomPoint = () => getRandomArrayElement(mockPoints);

export { getRandomPoint };
