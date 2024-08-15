import { Prisma } from "@prisma/client";
import { Input } from "../ui/input";

type FormInputNumberProps = {
    defaultValue?: number;
};

const name = Prisma.PropertyScalarFieldEnum.price;
// const name = 'price'

function PriceInput({ defaultValue }: FormInputNumberProps) {
    return (
        <div>
            <label htmlFor={name} className='capitalize'>
                Price ($)
            </label>
            <Input
                id={name}
                type='number'
                name={name}
                min={0}
                defaultValue={defaultValue || 100}
                required
            />
        </div>
    );
}
export default PriceInput;
