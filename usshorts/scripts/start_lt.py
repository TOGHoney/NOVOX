import logging

from libretranslate.main import main


class _QuietArgos(logging.Filter):
    def filter(self, record):
        return not record.name.startswith("argostranslate")


for _name in ("argostranslate", "argostranslate.utils"):
    _logger = logging.getLogger(_name)
    _logger.setLevel(logging.WARNING)
    _logger.addFilter(_QuietArgos())

if __name__ == "__main__":
    main()
