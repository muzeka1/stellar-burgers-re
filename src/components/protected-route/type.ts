import { ReactComponentElement, ReactNode } from "react";

export interface ProtectedRouteProps {
    anonymous?: boolean;
    children?: ReactNode;
}