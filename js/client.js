/* global TrelloPowerUp */

const COLOR_CODING_DEFAULT = {
  yellowThreshold: 5,
  orangeThreshold: 10,
  redThreshold: 14
};

const COLOR_GREEN = 'green';
const COLOR_YELLOW = 'yellow';
const COLOR_ORANGE = 'orange';
const COLOR_RED = 'red';

const ICON_WHITE = './images/calendar-white.svg';
const ICON_GRAY = './images/calendar-gray.svg';
const ICON_DARK = './images/calendar-dark.svg';

const BASE_URL = 'https://day-counter-trello-power-up.herokuapp.com/';

function cardBadges(t, opts) {
  return t.get('card', 'shared', 'daysTaken').then((daysTaken) => {
    if (daysTaken) {
      return [
        {
          text: daysTaken,
          color: COLOR_GREEN,
          icon: ICON_WHITE
        }
      ];
    } else {
      return daysOpen(t).then((daysOpen) =>
        t.get('board', 'shared', 'colorCoding').then((colorCoding) =>
          daysOpen > 0
            ? [
                {
                  text: daysOpen.toString(),
                  color: badgeColorFor(
                    colorCoding ? colorCoding : COLOR_CODING_DEFAULT,
                    daysOpen
                  ),
                  icon: iconFor(daysOpen)
                }
              ]
            : []
        )
      );
    }
  });
}

function cardDetailBadges(t, opts) {
  return t.get('card', 'shared', 'daysTaken').then((daysTaken) => {
    if (daysTaken) {
      return [
        {
          title: 'Day Counter',
          text: 'Done in ' + daysTaken + ' days',
          color: COLOR_GREEN,
          callback: (t, opts) => {
            const permissions = t.getContext().permissions;
            if (permissions.card === 'write') {
              t.remove('card', 'shared', 'daysTaken');
            }
          }
        }
      ];
    } else {
      return daysOpen(t).then((daysOpen) =>
        t.get('board', 'shared', 'colorCoding').then((colorCoding) => [
          {
            title: 'Day Counter',
            text: 'Open for ' + daysOpen.toString() + ' days',
            color: badgeColorFor(
              colorCoding ? colorCoding : COLOR_CODING_DEFAULT,
              daysOpen
            ),
            callback: (t, opts) => {
              const permissions = t.getContext().permissions;
              if (permissions.card === 'write') {
                t.set('card', 'shared', 'daysTaken', daysOpen.toString());
              }
            }
          }
        ])
      );
    }
  });
}

function boardButtons(t, opts) {
  return [
    {
      icon: {
        dark: BASE_URL + ICON_WHITE,
        light: BASE_URL + ICON_DARK
      },
      text: 'Day Counter',
      callback: (t) => {
        return t.popup({
          title: 'Color Coding',
          url: './color-coding.html'
        });
      },
      condition: 'admin'
    }
  ];
}

function daysOpen(t) {
  return t.card('id').then((card) => {
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

function badgeColorFor(colorCoding, daysOpen) {
  if (daysOpen >= colorCoding.redThreshold) {
    return COLOR_RED;
  } else if (daysOpen >= colorCoding.orangeThreshold) {
    return COLOR_ORANGE;
  } else if (daysOpen >= colorCoding.yellowThreshold) {
    return COLOR_YELLOW;
  } else {
    return null;
  }
}

function iconFor(daysOpen) {
  return daysOpen >= 5 ? ICON_WHITE : ICON_GRAY;
}

TrelloPowerUp.initialize({
  'card-badges': cardBadges,
  'card-detail-badges': cardDetailBadges,
  'board-buttons': boardButtons
});
