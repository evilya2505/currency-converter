import { encoded, translations } from "./data.js";

// Поля, которые при раскодировании должны остаться в изначальном виде
const notInclude = ["groupId", "service", "formatSize", "ca"];
// Новый объект с расшифрованными полями
const newEncodedObj = encoded.map((item) => {
  let tempObj = { ...item };
  for (let key in tempObj) {
    if (translations[tempObj[key]] && !notInclude.includes(key)) {
      tempObj = { ...tempObj, [key]: translations[tempObj[key]] };
    }
  }
  return tempObj;
});

// Вывод списка уникальных id из encoded
const uniqueIds = encoded.reduce((acc, item) => {
  for (let key in item) {
    if (
      key !== "groupId" &&
      key.includes("Id") &&
      item[key] &&
      !acc.includes(item[key])
    ) {
      acc.push(item[key]);
    }
  }
  return acc;
}, []);

// Проверка по translations
const isSame =
  !uniqueIds.filter((id) => !translations[id] && translations[id] !== "")
    .length > 0; // false, так как выпадает значение id 145868 которое не содержится в словаре translations, но является уникальным id

console.log("encoded: ", newEncodedObj);
console.log("uniqieIds: ", uniqueIds);
