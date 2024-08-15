"use client";

import { useState, type ChangeEvent, type FocusEvent } from "react";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { LuMinus, LuPlus } from "react-icons/lu";
import { Input } from "../ui/input";

function CounterInput({
    detail,
    defaultValue,
}: {
    detail: string;
    defaultValue?: number;
}) {
    const [count, setCount] = useState<number | "">(defaultValue || 1);

    const increaseCount = () => {
        setCount((prevCount) =>
            typeof prevCount === "number" ? prevCount + 1 : 1
        );
    };

    // Decrease the count, ensuring it doesn't go below 0
    const decreaseCount = () => {
        setCount((prevCount) =>
            typeof prevCount === "number" && prevCount > 0 ? prevCount - 1 : 0
        );
    };

    // Handle input change to set the count directly
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (newValue === "" || !isNaN(Number(newValue))) {
            setCount(newValue === "" ? "" : Number(newValue));
        }
    };

    // Handle blur event to reset count if input is empty
    const handleBlur = () => {
        if (count === "" || isNaN(Number(count))) {
            setCount(defaultValue || 1);
        }
    };

    return (
        <Card className='mb-4'>
            <CardHeader className='flex flex-col gap-y-5'>
                <div className='flex items-center justify-between flex-wrap'>
                    <div className='flex flex-col'>
                        <h2 className='font-medium capitalize'>{detail}</h2>
                        <p className='text-muted-foreground'>
                            Specify the number of {detail}
                        </p>
                    </div>

                    <div className='flex items-center gap-4'>
                        <Button
                            variant='outline'
                            size='icon'
                            type='button'
                            disabled={count === 1}
                            onClick={decreaseCount}
                        >
                            <LuMinus className='w-5 h-5 text-primary' />
                        </Button>
                        <Input
                            type='number'
                            name={detail}
                            value={count}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            className='hide-number-spin text-xs font-bold w-10 text-center'
                        />
                        <Button
                            variant='outline'
                            size='icon'
                            type='button'
                            onClick={increaseCount}
                        >
                            <LuPlus className='w-5 h-5 text-primary' />
                        </Button>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}
export default CounterInput;
