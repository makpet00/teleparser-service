export const convertFinMonth = (month: string) => {
    const MONTHES = [
      "tam",
      "hel",
      "maa",
      "huh",
      "tou",
      "kes",
      "hei",
      "elo",
      "syy",
      "lok",
      "mar",
      "jou",
    ];
    return String(MONTHES.indexOf(month) + 1 ?? null);
  };