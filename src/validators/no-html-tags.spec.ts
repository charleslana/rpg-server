import { IsString, validate } from 'class-validator';
import { NoHtmlTags } from './no-html-tags';

class TestDtoWithHtmlValidation {
  @NoHtmlTags({ message: 'A mensagem não pode conter tags HTML.' })
  @IsString()
  message: string;
}

class TestDtoWithHtmlValidationWithoutMessage {
  @NoHtmlTags()
  @IsString()
  message: string;
}

describe('NoHtmlTags validation', () => {
  it('deve ser válido quando o valor não contiver tags HTML', async () => {
    const test = new TestDtoWithHtmlValidation();
    test.message = 'validmessage';

    const errors = await validate(test);
    expect(errors.length).toBe(0);
  });

  it('deve ser inválido quando o valor contiver tags HTML', async () => {
    const test = new TestDtoWithHtmlValidation();
    test.message = '<b>invalidmessage</b>';

    const errors = await validate(test);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.noHtmlTags).toBe(
      'A mensagem não pode conter tags HTML.',
    );
  });

  it('deve ser inválido quando o valor for uma string com tags HTML', async () => {
    const test = new TestDtoWithHtmlValidationWithoutMessage();
    test.message = '<script>alert("test")</script>';

    const errors = await validate(test);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.noHtmlTags).toBe(
      'message must not contain HTML tags',
    );
  });

  it('deve ser válido quando o valor for uma string sem tags HTML', async () => {
    const test = new TestDtoWithHtmlValidation();
    test.message = 'mensagem';

    const errors = await validate(test);
    expect(errors.length).toBe(0);
  });
});
