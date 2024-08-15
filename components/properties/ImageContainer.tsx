import Image from "next/image";

function ImageContainer({
    mainImage,
    name,
}: {
    mainImage: string;
    name: string;
}) {
    return (
        <section className='h-[300px] md:h-[500px] relative mt-8'>
            <Image
                src={mainImage}
                alt={name}
                sizes='100vw'
                fill
                priority
                className='object-cover rounded-md'
            />
        </section>
    );
}
export default ImageContainer;
