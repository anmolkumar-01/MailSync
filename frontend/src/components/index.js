import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import UploadFile from "./custom/UploadFile";
import SelectRecipients from "./custom/SelectRecipients";
import ComposeAndSend from "./custom/ComposeAndSend";
import AutoGoogleLogin from "./auth/AutoGoogleLogin";
import {ScrollArea, ScrollBar} from './ui/scroll-area'
import Notification from "./custom/Notification";
import NotificationContainer from "./custom/NotificationContainer";
import EmailSkeleton from "./skeletons/EmailSkeleton";
import FileIconManual from "./custom/FileIconManual";
import { AddEmailModal } from "./custom/AddEmailModal";
import UserIcon from "./custom/UserIcon";

import AnimatedGradientText from "./custom/AnimatedGradientText"
import FeatureCard from "./custom/FeatureCard"
import GoogleIcon from "./custom/GoogleIcon"

import FeaturesSection from "./home/FeaturesSection"
import HeroSection from "./home/HeroSection"
import HowItWorksSection from "./home/HowItWorksSection"

import Footer from "./layout/Footer"
import Navbar from "./layout/Navbar"

//  todo: remove them
import {MOCK_USERS} from './dashboard/data'
import {MOCK_ORGS} from './dashboard/data'
import {MOCK_ACTIVITIES} from './dashboard/data'

import Header from "./dashboard/Header";
import AdminPanel from './dashboard/AdminPanel'
import OrgDashboard from './dashboard/OrgDashboard'
import Organizations from './dashboard/Organizations'
import EmailAnalyticsChart from './dashboard/EmailAnalyticsChart'
import AdminOrgsTable from './dashboard/AdminOrgsTable'
import Sidebar from "./dashboard/Sidebar";
import StatCard from './dashboard/StatCard'
import PricingDialog from "./dashboard/PricingDialog";
import OrgsTabs from "./dashboard/OrgsTabs";


// ---------- Skeletons -------------
import HomePageSkeleton from "./skeletons/HomePageSkeleton";
import OrganizationSkeleton from "./skeletons/OrganizationSkeleton";
import ExtractingEmailsSkeleton from "./skeletons/ExtractingEmailsSkeleton";
import OrgMembersSkeleton from "./skeletons/OrgMembersSkeleton";



export {
    Navbar,
    Input,
    Button,
    Checkbox,
    Textarea,
    ScrollArea,
    ScrollBar,
    UploadFile,
    SelectRecipients,
    ComposeAndSend,
    AutoGoogleLogin,
    Notification,
    NotificationContainer,
    EmailSkeleton,
    FileIconManual,
    AddEmailModal,
    UserIcon,

    AnimatedGradientText,
    FeatureCard,
    GoogleIcon,
    FeaturesSection,
    HeroSection,
    HowItWorksSection,
    Footer,
    Header,

    AdminPanel, 
    OrgDashboard,
    Organizations,
    EmailAnalyticsChart,
    AdminOrgsTable,
    Sidebar,
    StatCard,
    PricingDialog,
    OrgsTabs,
    
    MOCK_USERS,
    MOCK_ORGS,
    MOCK_ACTIVITIES,

    // ---------------- skeletons --------------
    HomePageSkeleton,
    OrganizationSkeleton,
    ExtractingEmailsSkeleton,
    OrgMembersSkeleton
}