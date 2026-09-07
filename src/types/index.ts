export interface FormDate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  travelers: string;
  tour: string;
  /** Выбранный заезд, «ГГГГ-ММ-ДД». Пусто, если пришли не из расписания. */
  departureDate: string;
  message: string;
  gender: string;
  location: string;
}
