/* global TrelloPowerUp */

function daysOpen(t, callback) {
  return t.card('id').then(card => {
    return daysBetween(createdDateOf(card), now());
  });
}

function daysBetween(startDate, endDate) {
  return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
}

function createdDateOf(card) {
  return new Date(1000 * parseInt(card.id.substring(0, 8), 16));
}

function now() {
  return Date.now();
}

function badgeColorFor(daysOpen) {
  if (daysOpen < 5) {
    return null;
  } else if (daysOpen >= 5 && daysOpen < 10) {
    return 'yellow';
  } else if (daysOpen >= 10 && daysOpen < 14) {
    return 'orange';
  } else {
    return 'red';
  }
}

function iconFor(daysOpen) {
  return daysOpen >= 5
    ? './images/calendar-white.svg'
    : './images/calendar-gray.svg';
}

TrelloPowerUp.initialize({
  'card-badges': (t, opts) => {
    return daysOpen(t).then(
      daysOpen =>
        daysOpen > 0
          ? [
              {
                text: daysOpen.toString(),
                color: badgeColorFor(daysOpen),
                icon: iconFor(daysOpen)
              }
            ]
          : []
    );
  },
  'card-detail-badges': (t, opts) => {
    return t.get('card', 'shared', 'daysTaken').then(daysTaken => {
      if (daysTaken) {
        return [
          {
            title: 'Day Counter',
            text: 'Done in ' + daysTaken + ' days',
            color: 'green',
            callback: (t, opts) => {
              const permissions = t.getContext().permissions;
              if (permissions.card === 'write') {
                t.remove('card', 'shared', 'daysTaken');
              }
            }
          }
        ];
      } else {
        return daysOpen(t).then(daysOpen => [
          {
            title: 'Day Counter',
            text: 'Open for ' + daysOpen.toString() + ' days',
            color: badgeColorFor(daysOpen),
            callback: (t, opts) => {
              const permissions = t.getContext().permissions;
              if (permissions.card === 'write') {
                t.set('card', 'shared', 'daysTaken', daysOpen);
              }
            }
          }
        ]);
      }
    });
  }
});
