const GroupType = {
  TRANSFER: `Transfer`,
  ACTIVITY: `Activity`,
};
const groupTypeToPreposition = new Map([
  [GroupType.TRANSFER, `to`],
  [GroupType.ACTIVITY, `in`],
]);
const groupToTypes = new Map([
  [GroupType.TRANSFER, [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`]],
  [GroupType.ACTIVITY, [`check-in`, `restaurant`, `sightseeing`]],
]);
const typeToGroup = new Map();
groupToTypes.forEach((value, key) => value.forEach((type) => typeToGroup.set(type, key)));
const cities = [`Geneva`, `Copenhagen`, `Amsterdam`, `Lisbon`, `Riga`, `Helsinki`, `Dresden`];

export {GroupType, groupToTypes, groupTypeToPreposition, typeToGroup, cities};
