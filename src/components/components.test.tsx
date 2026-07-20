/**
 * Component smoke tests for pure/presentational components.
 *
 * Uses @testing-library/react v9 API — no `screen` export in v9;
 * use the destructured result from `render(...)` instead.
 *
 * Components under test:
 *   - Loading       — spinner, no props
 *   - ProgressBar   — linear progress with label
 *   - Percent       — circular progress with label
 *   - ProtectedRoute — routing guard driven by UserContext
 */

import React from 'react';
import {render} from '@testing-library/react';
import {MemoryRouter, Routes, Route} from 'react-router-dom';

import {UserContext, UserContextType} from '../App';
import {User} from '../constants/schema';
import Loading from './Loading';
import ProgressBar from './ProgressBar';
import Percent from './Percent';
import ProtectedRoute from './ProtectedRoute';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Renders `protectedElement` at `/protected` with full routing context.
 *
 * React Router v6 `<Navigate>` redirects to `/`, where a "Home" sentinel is
 * mounted — this prevents the infinite-loop that happens when Navigate targets
 * the same path it's already on inside MemoryRouter.
 */
function renderProtectedRoute(user: User, protectedElement: React.ReactElement) {
  const ctx: UserContextType = {user, setUser: jest.fn()};

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <UserContext.Provider value={ctx}>
        <Routes>
          <Route path='/protected' element={protectedElement} />
          {/* Redirect target — gives Navigate somewhere to land */}
          <Route path='/' element={<div>Home Page</div>} />
        </Routes>
      </UserContext.Provider>
    </MemoryRouter>,
  );
}

/** Dummy protected component used as the guarded route's element. */
const Dummy = () => <div>Protected Content</div>;

// ─── Loading ──────────────────────────────────────────────────────────────────

describe('Loading', () => {
  it('renders without crashing', () => {
    const {container} = render(<Loading />);
    expect(container.firstChild).not.toBeNull();
  });
});

// ─── ProgressBar ─────────────────────────────────────────────────────────────

describe('ProgressBar', () => {
  it('renders without crashing', () => {
    const {container} = render(<ProgressBar progress={50} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('displays the rounded progress as a percentage label', () => {
    const {getByText} = render(<ProgressBar progress={42} />);
    expect(getByText('42%')).toBeInTheDocument();
  });

  it('displays 0% for zero progress', () => {
    const {getByText} = render(<ProgressBar progress={0} />);
    expect(getByText('0%')).toBeInTheDocument();
  });

  it('displays 100% for full progress', () => {
    const {getByText} = render(<ProgressBar progress={100} />);
    expect(getByText('100%')).toBeInTheDocument();
  });

  it('rounds a fractional progress value for display', () => {
    // Math.round(67.7) === 68
    const {getByText} = render(<ProgressBar progress={67.7} />);
    expect(getByText('68%')).toBeInTheDocument();
  });
});

// ─── Percent ──────────────────────────────────────────────────────────────────

describe('Percent', () => {
  it('renders without crashing', () => {
    const {container} = render(<Percent progress={75} hex='#00C9B7' size={80} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('displays the rounded progress as a percentage label', () => {
    const {getByText} = render(<Percent progress={75} hex='#00C9B7' size={80} />);
    expect(getByText('75%')).toBeInTheDocument();
  });

  it('displays 0% for zero progress', () => {
    const {getByText} = render(<Percent progress={0} hex='#FF0000' size={60} />);
    expect(getByText('0%')).toBeInTheDocument();
  });

  it('renders with size=60 (h6 Typography variant)', () => {
    // size=60 triggers the h6 Typography variant — should still render correctly
    const {getByText} = render(<Percent progress={33} hex='#123456' size={60} />);
    expect(getByText('33%')).toBeInTheDocument();
  });

  it('renders with large size (h5 Typography variant)', () => {
    // size != 60 triggers the h5 Typography variant
    const {getByText} = render(<Percent progress={88} hex='#654321' size={120} />);
    expect(getByText('88%')).toBeInTheDocument();
  });
});

// ─── ProtectedRoute ───────────────────────────────────────────────────────────

describe('ProtectedRoute', () => {
  describe('type="loggedOut" — accessible only when NOT logged in', () => {
    it('renders the component when the user is not logged in', () => {
      const {getByText} = renderProtectedRoute(
        {loggedIn: false, completed: false},
        <ProtectedRoute type='loggedOut' component={<Dummy />} />,
      );
      expect(getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects away when the user IS logged in', () => {
      const {queryByText} = renderProtectedRoute(
        {loggedIn: true, completed: false},
        <ProtectedRoute type='loggedOut' component={<Dummy />} />,
      );
      expect(queryByText('Protected Content')).toBeNull();
    });
  });

  describe('type="loggedInAndCompleted" — accessible only when logged in AND test done', () => {
    it('renders the component when the user is logged in and completed', () => {
      const {getByText} = renderProtectedRoute(
        {loggedIn: true, completed: true},
        <ProtectedRoute type='loggedInAndCompleted' component={<Dummy />} />,
      );
      expect(getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects when the user is logged in but has NOT completed the test', () => {
      const {queryByText} = renderProtectedRoute(
        {loggedIn: true, completed: false},
        <ProtectedRoute type='loggedInAndCompleted' component={<Dummy />} />,
      );
      expect(queryByText('Protected Content')).toBeNull();
    });

    it('redirects when the user is not logged in', () => {
      const {queryByText} = renderProtectedRoute(
        {loggedIn: false, completed: true},
        <ProtectedRoute type='loggedInAndCompleted' component={<Dummy />} />,
      );
      expect(queryByText('Protected Content')).toBeNull();
    });
  });

  describe('type="loggedInAndUncompleted" — accessible only when logged in and test NOT done yet', () => {
    it('renders the component when the user is logged in and has not completed the test', () => {
      const {getByText} = renderProtectedRoute(
        {loggedIn: true, completed: false},
        <ProtectedRoute type='loggedInAndUncompleted' component={<Dummy />} />,
      );
      expect(getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects when the user is logged in AND has already completed the test', () => {
      const {queryByText} = renderProtectedRoute(
        {loggedIn: true, completed: true},
        <ProtectedRoute type='loggedInAndUncompleted' component={<Dummy />} />,
      );
      expect(queryByText('Protected Content')).toBeNull();
    });
  });

  describe('type="admin" — accessible only when logged in as an admin', () => {
    it('renders the component for an admin user', () => {
      const {getByText} = renderProtectedRoute(
        {loggedIn: true, completed: true, isAdmin: true},
        <ProtectedRoute type='admin' component={<Dummy />} />,
      );
      expect(getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects for a logged-in non-admin user', () => {
      const {queryByText} = renderProtectedRoute(
        {loggedIn: true, completed: true, isAdmin: false},
        <ProtectedRoute type='admin' component={<Dummy />} />,
      );
      expect(queryByText('Protected Content')).toBeNull();
    });
  });

  describe('loading state — when user state is not yet resolved', () => {
    it('shows the Loading spinner (not the protected content) when loggedIn is undefined', () => {
      // ProtectedRoute guards behind `loggedIn === undefined` → renders <Loading />
      const {queryByText} = renderProtectedRoute(
        {loggedIn: undefined, completed: false},
        <ProtectedRoute type='loggedInAndCompleted' component={<Dummy />} />,
      );
      expect(queryByText('Protected Content')).toBeNull();
    });

    it('shows the Loading spinner (not the protected content) when completed is undefined', () => {
      const {queryByText} = renderProtectedRoute(
        {loggedIn: true, completed: undefined},
        <ProtectedRoute type='loggedInAndCompleted' component={<Dummy />} />,
      );
      expect(queryByText('Protected Content')).toBeNull();
    });
  });
});
