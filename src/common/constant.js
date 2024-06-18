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
  INGREDIENTS: 'ingredients_management'
}

export const ROUTE_TO_SCENE = {
  '/': SCENES.HOME,
  '/dashboard': SCENES.DASHBOARD,
  '/login': SCENES.LOGIN,
  '/register': SCENES.REGISTER,
  '/dashboard/recipe/create-recipe': SCENES.CREATE_RECIPE,
  '/dashboard/ingredients': SCENES.INGREDIENTS
}

export const SCENES_FORBIDDEN = {
  [ROLES.ADMIN]: [],
  [ROLES.USER]: [SCENES.INGREDIENTS]
}