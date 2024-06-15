import { fetchV1Authorized } from "@spiceswap/utils/fetch";

export const saveRecipe = async (recipeData) => {
	const response = await fetchV1Authorized('/api/recipe/add-recipe', {
		method: 'POST',
		body: JSON.stringify(recipeData)
	});
	return response.json();
};