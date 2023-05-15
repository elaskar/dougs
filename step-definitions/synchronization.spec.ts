import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('../features/synchronization.feature');

defineFeature(feature, (test) => {
  test('Synchronize correct datas', ({ given, when, then }) => {
    given('following movements', (table) => {});

    given('following checkpoints', (table) => {});

    when('I synchronize', (table) => {});

    then('I should have success', (table) => {});
  });
});
