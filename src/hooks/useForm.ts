// useForm.ts
import { useState, ChangeEvent,useCallback} from 'react';

type FormFieldType = string | number | boolean | File | null;
type FormValues = Record<string, FormFieldType>;

interface UseFormProps<T extends FormValues> {
  initialValues: T;
  validate: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void;
}


export const useForm = <T extends { [K in keyof T]: FormFieldType }>({
  initialValues,
  validate,
  onSubmit
}: UseFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof T>>(new Set()); 
  
  const setFieldTouched = useCallback((field: keyof T) => {
    setTouchedFields(prev => new Set(prev).add(field));
  }, []);


  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setTouchedFields(prev => new Set(prev).add(name as keyof T));
  }, []);

  const handleFileChange = useCallback((name: keyof T, file: File | null) => {
    setValues(prev => ({ ...prev, [name]: file }));
    setTouchedFields(prev => new Set(prev).add(name));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    // Set all fields as touched
    setTouchedFields(new Set(Object.keys(values) as Array<keyof T>));
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  }, [values, validate, onSubmit]);


  

  return { values, errors, handleChange, handleFileChange, handleSubmit,setFieldTouched};
};