import Login from "@/app/auth/login";
import NotFound from "@/app/errors/not-found";
import Settings from "@/app/setting/setting";
import Maintenance from "@/components/common/maintenance";
import ErrorBoundary from "@/components/error-boundry/error-boundry";
import ForgotPassword from "@/components/forgot-password/forgot-password";
import LoadingBar from "@/components/loader/loading-bar";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./auth-route";
import ProtectedRoute from "./protected-route";
import Home from "@/app/dashboard/Home";
import Profile from "@/app/profile/Profile";
import AboutUs from "@/app/about-us/AboutUs";
import MissionVision from "@/app/mission-vision/MissionVision";
import ActiveMeetings from "@/app/Meetings/ActiveMeetings";
import InactiveMeetings from "@/app/Meetings/InactiveMeetings";
import Leads from "@/app/lead/Leads";
import Enquiry from "@/app/enquiry/Enquiry";
import Portfolio from "@/app/portfolio/Portfolio";
import OneToOne from "@/app/onetoone/OneToOne";
import Team from "@/app/team/Team";
import Guest from "@/app/guest/Guest";
import Feedback from "@/app/feedback/Feedback";
import Contact from "@/app/contact/Contact";
import NewUser from "@/app/user/NewUser";
import NewUserView from "@/app/user/NewUserView";
import ActiveUser from "@/app/user/ActiveUser";
import InactiveUser from "@/app/user/InactiveUser";
import MobileUser from "@/app/user/MobileUser";
import ShareUser from "@/app/shareuser/ShareUser";
import ShareUserById from "@/app/shareuser/ShareUserById";
import Download from "@/app/download/Download";
import BonusPoint from "@/app/bonus-point/BonusPoint";
import AttendenceReport from "@/app/report/AttendenceReport";
import Activity from "@/app/activity/Activity";
import ActivityPrint from "@/app/report/ActivityPrint";
import EditUser from "@/app/user/EditUser";

function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<AuthRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ForgotPassword />
              </Suspense>
            }
          />
          <Route path="/maintenance" element={<Maintenance />} />
        </Route>

        <Route path="/" element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="/about-us"
            element={
              <Suspense fallback={<LoadingBar />}>
                <AboutUs />
              </Suspense>
            }
          />
          <Route
            path="/activity"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Activity />
              </Suspense>
            }
          />
          <Route
            path="/mission-and-vission"
            element={
              <Suspense fallback={<LoadingBar />}>
                <MissionVision />
              </Suspense>
            }
          />
          <Route
            path="/enquiry"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Enquiry />
              </Suspense>
            }
          />
          <Route
            path="/portfolio"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Portfolio />
              </Suspense>
            }
          />
          <Route
            path="/active-meetings"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ActiveMeetings />
              </Suspense>
            }
          />
          <Route
            path="/inactive-meetings"
            element={
              <Suspense fallback={<LoadingBar />}>
                <InactiveMeetings />
              </Suspense>
            }
          />
          <Route
            path="/one-to-one"
            element={
              <Suspense fallback={<LoadingBar />}>
                <OneToOne />
              </Suspense>
            }
          />
          <Route
            path="/team"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Team />
              </Suspense>
            }
          />
          <Route
            path="/visitor-guest"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Guest />
              </Suspense>
            }
          />
          <Route
            path="/bonus-point"
            element={
              <Suspense fallback={<LoadingBar />}>
                <BonusPoint />
              </Suspense>
            }
          />
          <Route
            path="/lead"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Leads />
              </Suspense>
            }
          />
          <Route
            path="/feedback"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Feedback />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Contact />
              </Suspense>
            }
          />
          <Route
            path="/new-user"
            element={
              <Suspense fallback={<LoadingBar />}>
                <NewUser />
              </Suspense>
            }
          />
          <Route
            path="/user-view"
            element={
              <Suspense fallback={<LoadingBar />}>
                <NewUserView />
              </Suspense>
            }
          />
          <Route
            path="/user-edit"
            element={
              <Suspense fallback={<LoadingBar />}>
                <EditUser />
              </Suspense>
            }
          />
          <Route
            path="/active-user"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ActiveUser />
              </Suspense>
            }
          />
          <Route
            path="/inactive-user"
            element={
              <Suspense fallback={<LoadingBar />}>
                <InactiveUser />
              </Suspense>
            }
          />
          <Route
            path="/mobile-user"
            element={
              <Suspense fallback={<LoadingBar />}>
                <MobileUser />
              </Suspense>
            }
          />
          <Route
            path="/share-user"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ShareUser />
              </Suspense>
            }
          />
          <Route
            path="/share-view"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ShareUserById />
              </Suspense>
            }
          />
          <Route
            path="/download"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Download />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="/report/attendence-report"
            element={
              <Suspense fallback={<LoadingBar />}>
                <AttendenceReport />
              </Suspense>
            }
          />
          <Route
            path="/report/activity-print"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ActivityPrint />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default AppRoutes;
