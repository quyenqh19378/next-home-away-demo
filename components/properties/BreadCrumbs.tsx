import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "../ui/breadcrumb";

function BreadCrumbs({ name }: { name: string }) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href='/'>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink>{name}</BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
export default BreadCrumbs;
