# Task Checklist

- [ ] Update scoring logic in `lib/scoring.ts`
    - [ ] Update `calculatePositionPoints` with new scale (25, 18, 15...)
    - [ ] Update `calculateChampionshipPoints` with new values (100, 50, 50)
- [ ] Update test suites
    - [ ] Update `lib/scoring.test.ts` expected values
    - [ ] Update `scripts/test-scoring-simple.js` expected values
- [ ] Update documentation
    - [ ] Update `SCORING_ENGINE.md`
    - [ ] Update `motogp-betting-spec.md`
- [ ] Verification
    - [ ] Run `npm test` or `npx jest` (checking package.json for test script)
    - [ ] Run `node scripts/test-scoring-simple.js`
