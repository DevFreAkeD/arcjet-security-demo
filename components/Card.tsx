interface CardProps {
    title: string;
    description: string;
    href: string;
    icon?: React.ReactNode;
  }
  
  export function Card({ title, description, href, icon }: CardProps) {
    return (
      <a
        href={href}
        className="p-6 border rounded-lg hover:border-blue-600 transition-colors group"
      >
        <div className="flex items-center gap-4 mb-2">
          {icon && (
            <div className="text-gray-200 group-hover:text-blue-600">{icon}</div>
          )}
          <h2 className="text-xl font-semibold group-hover:text-blue-600">
            {title}
          </h2>
        </div>
        <p className="text-gray-200 text-md">{description}</p>
      </a>
    );
  }