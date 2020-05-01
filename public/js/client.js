/* global TrelloPowerUp */

function daysBetween(startDate, endDate) {
  return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
}

function createdDateOf(card) {
  return new Date(1000 * parseInt(card.id.substring(0, 8), 16));
}

function now() {
  return Date.now();
}

TrelloPowerUp.initialize({
  'card-badges': (t, opts) => {
    return t.card('id').then(card => {
      return [
        {
          text: daysBetween(createdDateOf(card), now()).toString()
        }
      ];
    });
  }
});
