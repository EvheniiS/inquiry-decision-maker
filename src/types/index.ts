// Project Names types
export interface ProjectNames {
  project_names: string[];
  total_count: number;
  last_updated: string;
}

// Example.json types
export interface EnvironmentDetail {
  Environment_Version: string;
  Details: string[];
  Dates: string[];
  StartDate: string;
  EndDate: string;
}

export interface InquiryData {
  Inquiry: string;
  Environment_Details: EnvironmentDetail[];
}

// Component Props types
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}