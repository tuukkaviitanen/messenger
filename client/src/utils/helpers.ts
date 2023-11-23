import {type User} from './types';

const sortUsers = (users: User[]) => users.sort((a, b) => a.id.localeCompare(b.id));

export const usersArrayEqual = (array1?: User[], array2?: User[]) => {
	if (!array1 || !array2) {
		return array1 === array2;
	}

	const array1Sorted = sortUsers(array1);
	const array2Sorted = sortUsers(array2);

	return (
		array1Sorted.length === array2Sorted.length
		&& array1Sorted.every((value, index) => value.id === array2Sorted[index].id)
	);
};
