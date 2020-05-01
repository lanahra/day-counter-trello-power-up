/* global TrelloPowerUp */

function daysBetween(startDate, endDate) {
  return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
}

function createdDateOf(cardId) {
  return new Date(1000 * parseInt(id.substring(0, 8), 16));
}

function now() {
  return Date.now();
}

TrelloPowerUp.initialize({
  'card-badges': (t, opts) => {
    return t.card('id').then(cardId => {
      return [
        {
          text: daysBetween(createdDateOf(cardId), now()).toString()
        }
      ];
    });
  }
});
