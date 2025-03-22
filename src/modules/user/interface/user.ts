import { Role, User, UserAttribute, UserStatistic } from '@prisma/client';

export interface UserWithRole extends User {
  roles: Role[];
}

export interface UserWithAttributeAndStatistic extends User {
  attribute: UserAttribute;
  statistic: UserStatistic;
}
