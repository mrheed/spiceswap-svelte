import { t } from "@spiceswap/locale/i18n"

export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
}

export const SCENES = {
  HOME: 'home',
  DASHBOARD: 'dashboard',
  LOGIN: 'login',
  REGISTER: 'register',
  RECIPE: 'recipe_management',
  CREATE_RECIPE: 'create_recipe',
  MY_RECIPE: 'my_recipe',
  DETAIL_RECIPE: 'detail_recipe',
  INGREDIENTS: 'ingredients_management',
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

export const RECIPE_TYPE = {
  ORIGINAL: 'ORIGINAL',
  COPY: 'COPY'
}

export const MODIFICATION_REQUEST_TYPE = {
  IN: 'IN',
  OUT: 'OUT'
}

export const STATUS = {
  WAITING: 'WAITING',
  ACCEPTED: 'APPROVED',
  REJECTED: 'REJECTED',
  FAILED: 'FAILED'
}

export const MODIFICATION_REQUEST_STATUS = {
  [STATUS.WAITING]: t('pages.dashboard.modification-request.out.list-status.waiting'),
  [STATUS.ACCEPTED]: t('pages.dashboard.modification-request.out.list-status.accepted'),
  [STATUS.REJECTED]: t('pages.dashboard.modification-request.out.list-status.rejected'),
  [STATUS.FAILED]: t('pages.dashboard.modification-request.out.list-status.failed')
}

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
}