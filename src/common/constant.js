export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
}

export const SCENES = {
  HOME: 'home',
  DASHBOARD: 'dashboard',
  LOGIN: 'login',
  REGISTER: 'register',
  CREATE_RECIPE: 'create_recipe',
  MY_RECIPE: 'my_recipe',
  INGREDIENTS: 'ingredients_management',
  RECIPE: 'recipe_management',
  USERS: 'user_management'
}

export const ROUTE_TO_SCENE = {
  '/': SCENES.HOME,
  '/dashboard': SCENES.DASHBOARD,
  '/login': SCENES.LOGIN,
  '/register': SCENES.REGISTER,
  '/dashboard/recipe/create': SCENES.CREATE_RECIPE,
  '/dashboard/ingredients': SCENES.INGREDIENTS,
  '/dashboard/recipe': SCENES.RECIPE,
  '/dashboard/users': SCENES.USERS,
  '/dashboard/recipe/my-recipes': SCENES.MY_RECIPE,
}

export const SCENES_FORBIDDEN = {
  [ROLES.ADMIN]: [SCENES.MY_RECIPE, SCENES.CREATE_RECIPE],
  [ROLES.USER]: [SCENES.INGREDIENTS, SCENES.RECIPE, SCENES.USERS]
}