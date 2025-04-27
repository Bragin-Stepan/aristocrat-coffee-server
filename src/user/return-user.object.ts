import { Prisma } from '@prisma/client'

export const returnUserObject: Prisma.UserSelect = {
	id: true,
  telegramId: true,
  username: true,
  firstName: true,
  lastName: true,
  role: true,
  phoneNumber: true,
  isTGPremium: true,
  isWasTGPremium: true,
  photoURL: true,
  languageCode: true,
  createdAt: true,
  updatedAt: true,
}
