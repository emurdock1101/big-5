/**
 * App-level smoke tests.
 *
 * The original placeholder tested for `getByText(/learn react/i)` which
 * never existed in this app and was always guaranteed to fail.
 *
 * A full App render test requires mocking:
 *   - react-apexcharts (uses browser canvas)
 *   - jsPDF / pdf.utils (uses HTMLCanvasElement.getContext)
 *   - @aws-amplify/ui-react/styles.css (CSS import unresolvable in Jest)
 *   - aws-amplify Auth + Storage
 *
 * That level of scaffolding belongs in an integration/e2e test suite, not
 * in unit tests. Individual views and utils are tested in their own files.
 *
 * TODO: configure moduleNameMapper for CSS files and mock browser-canvas
 * APIs so this test can be expanded into a real smoke test.
 */

test.todo('App renders without crashing (requires CSS + canvas mocks — see comment above)');
